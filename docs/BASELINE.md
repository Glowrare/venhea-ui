# Baseline and GitHub handoff

The prepared library has version `1.2.0`. All preparation changes belong before
the annotated local `v1.2.0` baseline tag. `main` should point at that exact
commit, with a clean working tree and no commits after the tag.

## Establish or verify the local baseline

The preparation task creates the local tag after validation and the final
baseline commit. To establish it manually in a fresh, untagged preparation:

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:package
git status --short
# Commit all intended preparation files before tagging.
git tag -a v1.2.0 -m "Aurora UI Kit 1.2.0 baseline"
```

Do not run `git tag -a` again if the tag already exists, and do not force-move it.
Verify the prepared repository:

```sh
git status --short
git branch --show-current
git cat-file -t v1.2.0
git rev-parse HEAD
git rev-parse 'v1.2.0^{commit}'
git log --oneline v1.2.0..main
```

Expected: empty status, `main`, tag object type `tag`, identical commit IDs, and
an empty log range. Ignored `dist/`, dependencies, and the package archive may
remain locally. There is no pre-generated changelog.

## Suggested remote steps — not performed during preparation

Authenticate the GitHub CLI yourself and replace `OWNER` with the intended
account or organization. Choose a private, empty repository without an initial
README, license, or `.gitignore` to avoid unrelated remote history.

```sh
gh repo create OWNER/aurora-ui-kit --private --source=. --remote=origin
git push -u origin main
git push origin v1.2.0
gh release create v1.2.0 --verify-tag --title "Aurora UI Kit 1.2.0" --notes "Historical sandbox baseline before release automation."
```

The final command creates the historical baseline GitHub Release against the
existing annotated tag. It has no attached package asset. Run it only when
remote Release creation is authorized. If using GitHub's web interface instead,
select the existing `v1.2.0` tag and use the same title and manual notes.

For an existing empty GitHub repository, replace the creation command with
`git remote add origin https://github.com/OWNER/aurora-ui-kit.git`. If the remote
already contains history, inspect and reconcile it; do not force-push.

## Reserved for recording

Create the test feature branch and PR during the recording. Leave semantic-release
installation/configuration, automated versioning and changelogs, tag creation,
workflow permissions, GitHub Release publication, and package asset attachments
to that task. No release workflow, tag-triggered artifact job, repository rules,
or secrets have been prepared here.
