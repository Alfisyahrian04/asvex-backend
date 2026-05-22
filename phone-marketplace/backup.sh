#!/bin/bash

mongodump \
--uri=$MONGO_URI \
--out=./backup
