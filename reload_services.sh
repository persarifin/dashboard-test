#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'reload_services.sh <name>'
    exit 0
fi

pm2 reload --silent --update-env dashboard-$1