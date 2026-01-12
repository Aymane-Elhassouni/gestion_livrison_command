<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
require_once __DIR__ . '/../vendor/autoload.php';
use src\Entity\User;
use src\Database\DatabaseConnection;
use src\Service\Auth;
use src\Repository\UserRepository;

$auth = new src\Service\Auth();

$action = $_GET['action'] ?? '';

if ($action === 'register') {
    $auth->Register();
} elseif ($action === 'login') {
    $auth->Login();
}elseif($action === 'logout'){
    $auth->Logout();
}else {
    die("Aucune action spécifiée. L'action actuelle est : " . $action);
}