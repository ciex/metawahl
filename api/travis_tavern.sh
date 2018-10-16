#!/bin/bash

# Starts the Flask development server in the background and then runs pytest suite,
# killing the Flask process afterwards. For this to work, Flask debug mode must be
# deactivated, or an orphan process will be left over.


METAWAHL_CONFIG=test.conf.py python app/main.py &
FLASK_PID=$!
echo "pid" $FLASK_PID
echo $(pwd)
sleep 5
pytest -v
TEST_RESULT=$?
kill -9 $FLASK_PID

exit $TEST_RESULT
