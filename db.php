<?php
function connect_mssql()
{
    $server = "192.168.1.171";
    $database = "manifest";
    $connection_string = 'DRIVER={SQL server};SERVER=' . $server . ';DATABASE=' . $database;
    $username = 'sa';
    $password = '';
    $connection = odbc_connect($connection_string, $username, $password) or die("Couldn't connect to SQL Server on " . $server);

    if ($connection === FALSE) {
        die("Couldn't connect");
    }

    return $connection;
}