#!/usr/bin/env bash
set -e

# The following line ensure we run from the project root
PROJECT_ROOT=`git rev-parse --show-toplevel`
cd $PROJECT_ROOT

# Find the current version from Cargo.toml
VERSION=`grep "^version" ./bin/node/cli/Cargo.toml | egrep -o "([0-9\.]+)"`
GITUSER=fuu
GITREPO=anchor

# Build the image
echo "Building ${GITUSER}/${GITREPO}:latest docker image, hang on!"
time docker build -f ./docker/anchor_builder.Dockerfile -t ${GITUSER}/${GITREPO}:latest . --progress=plain
#docker tag ${GITUSER}/${GITREPO}:latest ${GITUSER}/${GITREPO}:v${VERSION}

# Show the list of available images for this repo
echo "Image is ready"
docker images | grep ${GITREPO}