#!/bin/bash

grunt
cp -r ./dist/* ~/grafana/data/plugins/organisations/
