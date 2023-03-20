#!/usr/bin/env bash

args=$@

# handle when arguments not provided. run arguments provided to script.
if [ "$args" = "" ] ; then
    printf "Note: Please try providing an argument to the script.\n\n"
    exit 1
else
    printf "*** Running Anchor Node Docker container with provided arguments: $args\n\n"
    docker run --rm -it fuu/anchor $args
fi