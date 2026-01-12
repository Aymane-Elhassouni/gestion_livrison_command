<?php

class Commande{
    private int $id;
    private string $title;
    private string $adresse;
    private string $status;
    private string $client_id;

    /**
     * Get the value of title
     */ 
    public function getTitle(){
        return $this->title;
    }

    /**
     * Set the value of title
     *
     * @return  self
     */ 
    public function setTitle($title){
        $this->title = $title;

        return $this;
    }

    /**
     * Get the value of adresse
     */ 
    public function getAdresse(){
        return $this->adresse;
    }

    /**
     * Set the value of adresse
     *
     * @return  self
     */ 
    public function setAdresse($adresse){
        $this->adresse = $adresse;

        return $this;
    }

    /**
     * Get the value of client_id
     */ 
    public function getClient_id(){
        return $this->client_id;
    }

    /**
     * Get the value of id
     */ 
    public function getId(){
        return $this->id;
    }
}