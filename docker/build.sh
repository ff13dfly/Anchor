#!/usr/bin/env bash
set -e

pushd .

# The following line ensure we run from the project root
PROJECT_ROOT=`git rev-parse --show-toplevel`
cd $PROJECT_ROOT

# Find the current version from Cargo.toml
VERSION=`grep "^version" ./bin/node/cli/Cargo.toml | egrep -o "([0-9\.]+)"`
GITUSER=parity
GITREPO=substrate

echo "Building from ${GITUSER}/${GITREPO}:latest docker image, hang on!"
echo "Anchor pallet will be combine to the substrate and build."
time docker build -f ./docker/anchor_builder.Dockerfile -t anchor/test:latest .
docker tag anchor:latest anchor:v${VERSION}

# Show the list of available images for this repo
echo "Anchor test image is ready"
docker images | grep ${GITREPO}

popd
