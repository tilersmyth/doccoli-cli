#!/bin/sh
set -o errexit

File=./package.json

if grep -q @undoc/ts-gen "$File"; then
  echo "Removing @undoc/ts-gen"
  yarn remove @undoc/ts-gen
fi

if grep -q @undoc/ts-parse "$File"; then
  echo "Removing @undoc/ts-parse"
  yarn remove @undoc/ts-parse
fi