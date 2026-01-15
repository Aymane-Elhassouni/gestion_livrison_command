<?php
include 'Auteur.php';
class Livre{
    private int $id;
    private string $titre;
    private string $description;
    private Auteur $auteur;

    public function getId(){
        return $this->id;
    }

    public function getTitre(){
        return $this->titre;
    }
    public function setTitre(string $titre){
        $this->titre = $titre;
    }

    public function getDescription(){
        return $this->description;
    }
    public function setDescription(string $description){
        $this->description = $description;
    }

    public function getAuteur(){
        return $this->auteur;
    }
    public function setAuteur(Auteur $auteur){
        $this->auteur = $auteur;
    }
}