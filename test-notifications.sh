#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW5odnBpb2UwMDBhbTV1NTMxMHIwNnVrIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzc1MTU4Nzg3LCJleHAiOjE3NzU3NjM1ODd9.O2xpJ4cjy9wmwTC8KCc_jt3l6qbQeTX2Fi3-tq1DHuo"

# Create a task with due date tomorrow
TOMORROW=$(date -u -d "+1 day" '+%Y-%m-%dT%H:%M:%S.000Z')

echo "=== Creating a task with due date tomorrow ($TOMORROW) ==="
TASK_RESPONSE=$(curl -s -X POST http://localhost:3001/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Upcoming Task\",
    \"description\": \"This should trigger a notification\",
    \"priority\": \"HIGH\",
    \"dueDate\": \"$TOMORROW\",
    \"status\": \"TODO\"
  }")

TASK_ID=$(echo "$TASK_RESPONSE" | jq -r '.id')
echo "Task created: $TASK_ID"
echo ""

# Check pending notifications
echo "=== Checking pending notifications ==="
curl -s -X GET "http://localhost:3001/notifications/pending" \
  -H "Authorization: Bearer $TOKEN" | jq .
