import { execSync, spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const CLI_PATH = path.join(__dirname, '../dist/index.js');
const FIXTURES_PATH = path.join(__dirname, '../__fixtures__');
const GOOD_PACKAGES = path.join(FIXTURES_PATH, 'good-packages');
const BAD_PACKAGES = path.join(FIXTURES_PATH, 'bad-packages');

/**
 * Helper to run the CLI and capture output/exit code
 */
function runCli(
  args: string[],
  cwd: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const child = spawn('node', [CLI_PATH, ...args], {
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

/**
 * Helper to create a temporary copy of a fixture for testing mutations
 */
function copyFixture(fixtureName: string): string {
  const source = path.join(FIXTURES_PATH, fixtureName);
  const tempDir = path.join(FIXTURES_PATH, `temp-${fixtureName}-${Date.now()}`);

  // Copy directory recursively
  fs.cpSync(source, tempDir, { recursive: true });

  return tempDir;
}

/**
 * Helper to clean up temporary fixtures
 */
function cleanupFixture(tempDir: string): void {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

const ROOT_DIR = path.join(__dirname, '..');

describe('CLI Integration Tests', () => {
  beforeAll(() => {
    // Build the CLI if it doesn't exist (needed for CI)
    if (!fs.existsSync(CLI_PATH)) {
      execSync('pnpm build', { cwd: ROOT_DIR, stdio: 'inherit' });
    }
  });

  describe('monopeers check', () => {
    it('should have the CLI built', () => {
      expect(fs.existsSync(CLI_PATH)).toBe(true);
    });

    it('should exit with code 0 when no issues are found', async () => {
      const result = await runCli(['check'], GOOD_PACKAGES);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('checking internal packages for missing peer dependencies');
    });

    it('should exit with code 1 when issues are found', async () => {
      const result = await runCli(['check'], BAD_PACKAGES);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toContain('checking internal packages for missing peer dependencies');
      // Error messages go to stderr
      expect(result.stderr).toContain('check found these missing dependencies');
      // Verify it outputs the missing deps info
      expect(result.stderr).toContain('package-a');
      expect(result.stderr).toContain('peerDependencies');
    });
  });

  describe('monopeers fix', () => {
    let tempFixture: string;

    beforeEach(() => {
      tempFixture = copyFixture('bad-packages');
    });

    afterEach(() => {
      cleanupFixture(tempFixture);
    });

    it('should fix missing peer dependencies', async () => {
      // First verify check fails
      const checkBefore = await runCli(['check'], tempFixture);
      expect(checkBefore.exitCode).toBe(1);

      // Run fix
      const fixResult = await runCli(['fix'], tempFixture);
      expect(fixResult.exitCode).toBe(0);
      expect(fixResult.stdout).toContain('running the fix');

      // Verify check now passes
      const checkAfter = await runCli(['check'], tempFixture);
      expect(checkAfter.exitCode).toBe(0);
    });

    it('should update package.json files with correct dependencies', async () => {
      await runCli(['fix'], tempFixture);

      // Read package-a's package.json and verify it was updated
      const packageAPath = path.join(tempFixture, 'packages/package-a/package.json');
      const packageA = JSON.parse(fs.readFileSync(packageAPath, 'utf8'));

      // package-a should now have hoisted peer dependencies
      expect(packageA.peerDependencies).toEqual({
        'package-b': '1.0.0',
        'package-c': '1.0.0',
        'package-d': '1.0.0',
      });

      expect(packageA.devDependencies).toEqual({
        'package-b': '1.0.0',
        'package-c': '1.0.0',
        'package-d': '1.0.0',
      });
    });
  });

  describe('invalid commands', () => {
    it('should exit with code 1 for unknown command', async () => {
      const result = await runCli(['unknown'], GOOD_PACKAGES);

      expect(result.exitCode).toBe(1);
      // Error messages go to stderr
      expect(result.stderr).toContain('command unknown not found');
      expect(result.stderr).toContain('only check, and fix are available options');
    });

    it('should exit with code 1 when no command is provided', async () => {
      const result = await runCli([], GOOD_PACKAGES);

      expect(result.exitCode).toBe(1);
      // Error messages go to stderr
      expect(result.stderr).toContain('command undefined not found');
    });
  });

  describe('CLI binary execution', () => {
    it('should have executable shebang', () => {
      const cliContent = fs.readFileSync(CLI_PATH, 'utf8');
      expect(cliContent.startsWith('#!/usr/bin/env node')).toBe(true);
    });

    it('should be directly executable as a node script', () => {
      // Test that the CLI can be run directly with node
      const result = execSync(`node ${CLI_PATH} check`, {
        cwd: GOOD_PACKAGES,
        encoding: 'utf8',
      });

      expect(result).toContain('checking internal packages');
    });
  });
});
