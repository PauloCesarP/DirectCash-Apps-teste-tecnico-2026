#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW5odnBpb2UwMDBhbTV1NTMxMHIwNnVrIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzc1MTU4Nzg3LCJleHAiOjE3NzU3NjM1ODd9.O2xpJ4cjy9wmwTC8KCc_jt3l6qbQeTX2Fi3-tq1DHuo"

echo "=== Creating a test task ==="
TASK_RESPONSE=$(curl -s -X POST http://localhost:3001/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Main Task",
    "description": "This is a test task",
    "priority": "HIGH",
    "status": "TODO"
  }')

echo "$TASK_RESPONSE" | jq .

TASK_ID=$(echo "$TASK_RESPONSE" | jq -r '.id')
echo ""
echo "Task ID: $TASK_ID"
echo ""

echo "=== Creating a subtask ==="
SUBTASK_RESPONSE=$(curl -s -X POST "http://localhost:3001/tasks/$TASK_ID/subtasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Subtask 1"
  }')

echo "$SUBTASK_RESPONSE" | jq .

echo ""
echo "=== Getting all subtasks ==="
curl -s -X GET "http://localhost:3001/tasks/$TASK_ID/subtasks" \
  -H "Authorization: Bearer $TOKEN" | jq .
