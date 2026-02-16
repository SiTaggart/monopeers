import { afterAll, beforeAll, describe, expect, it, setDefaultTimeout } from 'bun:test';
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type CommandResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

const ROOT_DIR = path.join(__dirname, '..');
const FIXTURES_PATH = path.join(ROOT_DIR, '__fixtures__');
const GOOD_PACKAGES = path.join(FIXTURES_PATH, 'good-packages');
const BAD_PACKAGES = path.join(FIXTURES_PATH, 'bad-packages');

const binaryName = process.platform === 'win32' ? 'monopeers.cmd' : 'monopeers';

function runCommand(command: string, args: string[], cwd: string): Promise<CommandResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({ stdout, stderr, exitCode: code ?? 0 });
    });
  });
}

function createTempDir(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function copyFixture(fixtureName: string): string {
  const source = path.join(FIXTURES_PATH, fixtureName);
  const target = createTempDir(`monopeers-${fixtureName}-`);
  fs.cpSync(source, target, { recursive: true });
  return target;
}

describe('Distribution Smoke Integration', () => {
  setDefaultTimeout(180_000);

  const cleanupDirs: string[] = [];

  let packDir = '';
  let consumerDir = '';
  let tarballPath = '';
  let installedBinaryPath = '';
  let tarContents: string[] = [];
  let hasInstalledBinary = false;
  let usesConsumerInstallBinary = false;

  beforeAll(() => {
    packDir = createTempDir('monopeers-pack-');
    consumerDir = createTempDir('monopeers-consumer-');
    cleanupDirs.push(packDir, consumerDir);

    execFileSync('bun', ['run', 'build'], { cwd: ROOT_DIR, stdio: 'pipe' });
    execFileSync('bun', ['pm', 'pack', '--destination', packDir], {
      cwd: ROOT_DIR,
      stdio: 'pipe',
    });

    const tarballs = fs.readdirSync(packDir).filter((fileName) => fileName.endsWith('.tgz'));
    if (tarballs.length !== 1) {
      throw new Error(`Expected exactly one tarball, found ${tarballs.length}`);
    }
    tarballPath = path.join(packDir, tarballs[0]);

    tarContents = execFileSync('tar', ['-tf', tarballPath], { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);

    fs.writeFileSync(
      path.join(consumerDir, 'package.json'),
      JSON.stringify(
        { name: 'monopeers-smoke-consumer', private: true, version: '1.0.0' },
        undefined,
        2
      )
    );

    execFileSync('bun', ['add', tarballPath], {
      cwd: consumerDir,
      stdio: 'pipe',
    });

    installedBinaryPath = path.join(consumerDir, 'node_modules', '.bin', binaryName);
    usesConsumerInstallBinary = installedBinaryPath.startsWith(consumerDir);
    hasInstalledBinary = fs.existsSync(installedBinaryPath);
  });

  afterAll(() => {
    cleanupDirs.map((dirPath) => fs.rmSync(dirPath, { recursive: true, force: true }));
  });

  it('validates packed tarball contents and installed binary location', () => {
    expect(tarContents).toContain('package/dist/index.js');
    expect(tarContents).toContain('package/package.json');
    expect(tarContents.some((entry) => entry.startsWith('package/src/'))).toBe(false);
    expect(usesConsumerInstallBinary).toBe(true);
    expect(hasInstalledBinary).toBe(true);
  });

  it('runs check via installed binary for good and bad fixtures', async () => {
    const goodResult = await runCommand(installedBinaryPath, ['check'], GOOD_PACKAGES);
    expect(goodResult.exitCode).toBe(0);
    expect(goodResult.stdout).toContain('checking internal packages for missing peer dependencies');

    const badResult = await runCommand(installedBinaryPath, ['check'], BAD_PACKAGES);
    expect(badResult.exitCode).toBe(1);
    expect(badResult.stdout).toContain('checking internal packages for missing peer dependencies');
    expect(badResult.stderr).toContain('check found these missing dependencies');
  });

  it('runs fix via installed binary and makes follow-up check pass', async () => {
    const badFixtureCopy = copyFixture('bad-packages');
    cleanupDirs.push(badFixtureCopy);

    const checkBefore = await runCommand(installedBinaryPath, ['check'], badFixtureCopy);
    expect(checkBefore.exitCode).toBe(1);

    const fixResult = await runCommand(installedBinaryPath, ['fix'], badFixtureCopy);
    expect(fixResult.exitCode).toBe(0);
    expect(fixResult.stdout).toContain('running the fix');

    const checkAfter = await runCommand(installedBinaryPath, ['check'], badFixtureCopy);
    expect(checkAfter.exitCode).toBe(0);
  });
});
