<?php

$dsn = "mysql:host=localhost;dbname=sql5709229"
$dbusername = "root"
$dbpassword = "";

try {
    $pdo = new PDO($dsn, $dsnusername, $dbpassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}