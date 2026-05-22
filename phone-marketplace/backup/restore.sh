#!/bin/bash

mongorestore \
--uri=$MONGO_URI \
./backup
