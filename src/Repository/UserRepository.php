<?php
namespace src\Repository;
use src\Abstruct\User;
use src\Database\DatabaseConnection;


class UserRepository{
    private $register;
    public function __construct(DatabaseConnection $databaseConnection){
        $this->register = $databaseConnection->getConnection();
    }
    public function createUser($firstname,$lastname,$email,$password,$role){
        $sql = "INSERT INTO users (firstname,lastname,email,password,role) VALUE (:firstname,:lastname,:email,:password,:role)";
        $stmt = $this->register->prepare($sql);
        $stmt->bindParam("firstname",$firstname);
        $stmt->bindParam("lastname",$lastname);
        $stmt->bindParam("email",$email);
        $stmt->bindParam("password",$password);
        $stmt->bindParam("role",$role);
        return $stmt->execute();
    }
    public  function  getUserByEmail($email){
        $sql = "SELECT id,firstname,lastname,email,password,role FROM users WHERE email=:email LIMIT 1";
        $stmt = $this->register->prepare($sql);
        $stmt->bindParam(':email',$email);
        $stmt->execute();
        $stmt->setFetchMode(\PDO::FETCH_CLASS | \PDO::FETCH_PROPS_LATE, \src\Entity\User::class);
        return $stmt->fetch();
    }
}

