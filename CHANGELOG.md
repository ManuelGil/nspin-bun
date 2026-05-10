# Change Log

All notable changes to the "nspin-bun" package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-05-10

### Added

- Added full TypeScript declaration publishing support.
- Added Bun-first package infrastructure and lockfile support.
- Added package export validation using `@arethetypeswrong/cli`.
- Added release automation with `release-it`.
- Added Dependabot configuration for automated dependency maintenance.
- Added provenance-ready npm publishing configuration.
- Added compatibility validation for Bun, Node.js, and bundlers.

### Changed

- Migrated package infrastructure to a Bun-first workflow.
- Hardened package exports and ESM resolution behavior.
- Improved package validation pipeline and release workflow.
- Improved packaging hygiene and tarball validation process.
- Improved repository configuration and dependency maintenance strategy.
- Simplified and modernized lifecycle scripts and build pipeline.

### Fixed

- Fixed missing published type declarations in generated tarballs.
- Fixed ATTW resolution and type validation issues.
- Fixed packaging inconsistencies during npm publish dry-runs.

## [1.1.0] - 2025-03-27

### Added

- Add position option to spinner to allow customization of the spinner's position.
- Enhance frame update functionality to support custom frame updates.

## [1.0.0] - 2025-03-23

### Added

- Initial release of the nspin-bun package.

[Unreleased]: https://github.com/ManuelGil/nspin-bun/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/ManuelGil/nspin-bun/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/ManuelGil/nspin-bun/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ManuelGil/nspin-bun/releases/tag/v1.0.0
