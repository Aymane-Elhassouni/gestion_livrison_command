<?php

class Utilisateur{
    private int $id;
    private string $firstname;
    private string $latname;
    private string $email;
    private string $password;
    
    public function getId(){
        return $this->id;
    }

    public function getFirstname():string{
        return $this->firstname;
    }
    public function setFirstname($firstname){
        $this->firstname = $firstname;
        return $this;
    }

    public function getLastname():string{
        return $this->lastname;   
    }
    public function setLastname($lastname){
        $this->lastname = $lastname;
        return $this;
    }

    public function getEmail():string{
        return $this->email;
    }
    public function setEmail($email){
        $this->email = $email;
        return $this;
    }

    public function getPassword():string{
        return $this->password;
    }
    public function setPassword($password){
        $this->password = $password;
        return $this;
    }
}