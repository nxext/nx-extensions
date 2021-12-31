#!/usr/bin/env bash
##################################################################
# Originally from https://github.com/nrwl/nx/tree/master/scripts #
##################################################################

##################################################
# This shell script is executed by local-release.js #
##################################################

rm -rf dist
npx nx run-many --target=build --all --parallel || { echo 'Build failed' ; exit 1; }
