<?php

class Auteur{
    private int $id;
    private string $name;

    public function __construct(){

    }
    public function getId():int{
        return $this->id;
    }

    public function getName(){
        return $this->name;
    }
    public function steName(string $name){
        $this->name = $name;
    }
}