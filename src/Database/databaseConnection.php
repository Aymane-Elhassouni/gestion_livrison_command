<?php
namespace src\Database;
class DatabaseConnection{
    private $connection;
    public function getConnection(){
        try{
            $this->connection = new \PDO("mysql:host=localhost;dbname=gestionlivcli",'root','');
            $this->connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        }catch(\PDOException $e){
            echo "connexion faild : " . $e->getMessage();
        }
        return $this->connection;
    }
}