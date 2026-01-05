import { execSync, spawnSync } from 'node:child_process';
import { cp, mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');
const distEntry = path.join(repoRoot, 'dist', 'index.js');

const runCli = (args: string[], cwd = repoRoot) => {
  const result = spawnSync('node', [distEntry, ...args], {
    cwd,
    encoding: 'utf-8',
  });
  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    status: result.status ?? null,
  };
};

describe('monopeers CLI (integration)', () => {
  beforeAll(() => {
    execSync(path.join(repoRoot, 'node_modules', '.bin', 'tsup'), {
      cwd: repoRoot,
      stdio: 'inherit',
    });
  });

  it('runs check successfully against the good fixtures', () => {
    const workspace = path.join(repoRoot, '__fixtures__', 'good-packages');

    const result = runCli(['check'], workspace);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('checking internal packages for missing peer dependencies');
    expect(result.stdout).toContain('running');
  });

  it('exits with an error for invalid commands', () => {
    const result = runCli(['unknown-command']);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('command unknown-command not found');
  });

  it('fixes package.json files to match the expected peer dependencies', async () => {
    const tempDir = await mkdtemp(path.join(tmpdir(), 'monopeers-cli-'));
    const workspace = path.join(tempDir, 'bad-packages');
    const expectedWorkspace = path.join(repoRoot, '__fixtures__', 'good-packages');

    await cp(path.join(repoRoot, '__fixtures__', 'bad-packages'), workspace, { recursive: true });

    const result = runCli(['fix'], workspace);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('running the fix');

    const packages = [
      'package-a',
      'package-b',
      'package-c',
      'package-d',
      'package-e',
      'package-f',
      'package-g',
      'package-bundle',
    ];

    for (const pkg of packages) {
      const actual = JSON.parse(
        await readFile(path.join(workspace, 'packages', pkg, 'package.json'), 'utf-8')
      );
      const expected = JSON.parse(
        await readFile(path.join(expectedWorkspace, 'packages', pkg, 'package.json'), 'utf-8')
      );

      expect(actual).toEqual(expected);
    }
  });
});
