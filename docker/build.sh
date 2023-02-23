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

# Combine anchor pallet to substrate
# ANCHORUSER=ff13dfly
# ANCHORREPO=Anchor

# Build the image
#echo "Building ${GITUSER}/${GITREPO}:latest docker image, hang on!"
#time docker build -f ./docker/substrate_builder.Dockerfile -t ${GITUSER}/${GITREPO}:latest .
#docker tag ${GITUSER}/${GITREPO}:latest ${GITUSER}/${GITREPO}:v${VERSION}

echo "Building from ${GITUSER}/${GITREPO}:latest docker image, hang on!"
echo "Anchor pallet will be combine to the substrate and build."
time docker build -f ./docker/substrate_builder.Dockerfile -t ff13dfly/test:latest .
docker tag anchor:latest anchor:v${VERSION}

# Show the list of available images for this repo
echo "Image is ready"
docker images | grep ${GITREPO}

popd
