package main

import (
	"context"
	"encoding/json"
	"io"
	"os"
	"path/filepath"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Structure pour représenter le contenu du fichier JSON
type Data struct {
	Data []string `json:"data"`
}

func UpdateJSON(folderName string) error {
	// Chemin du fichier JSON
	jsonFilePath := filepath.Join("./data", "data.json")

	// Ouvrir le fichier JSON en lecture et écriture
	file, err := os.OpenFile(jsonFilePath, os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	// Décoder le contenu JSON dans une structure de données
	var data map[string][]string
	if err := json.NewDecoder(file).Decode(&data); err != nil && err != io.EOF {
		return err
	}

	// Si data est nil, initialiser avec un map vide
	if data == nil {
		data = make(map[string][]string)
	}

	// Vérifier si le dossier existe déjà dans le JSON
	if _, ok := data[folderName]; !ok {
		// Si le dossier n'existe pas, ajouter un tableau vide pour ce dossier
		data[folderName] = []string{}
	}

	// Réinitialiser le curseur au début du fichier
	if _, err := file.Seek(0, 0); err != nil {
		return err
	}

	// Tronquer le fichier avant d'écrire les données mises à jour
	if err := file.Truncate(0); err != nil {
		return err
	}

	// Encoder la structure de données en JSON et écrire dans le fichier
	if err := json.NewEncoder(file).Encode(data); err != nil {
		return err
	}

	return nil
}

// Fonction pour ajouter un nouveau dossier
func (a *App) AddFolder(folderName string) error {
	savePath := filepath.Join("./data", folderName)

	// Vérifier si le dossier existe déjà
	if _, err := os.Stat(savePath); os.IsNotExist(err) {
		// Créer le dossier s'il n'existe pas encore
		if err := os.MkdirAll(savePath, 0755); err != nil {
			return err
		}
		if err := UpdateJSON(folderName); err != nil {
			return err
		}
		return nil
	} else if err != nil {
		// Gérer d'autres erreurs qui pourraient survenir lors de la vérification du dossier
		return err
	}

	// Si le dossier existe déjà, renvoyer une erreur
	return os.ErrExist
}

func UpdateFileJSON(folderName, fileName string) error {
	// Chemin du fichier JSON
	jsonFilePath := filepath.Join("./data", "data.json")

	// Ouvrir le fichier JSON en lecture et écriture
	file, err := os.OpenFile(jsonFilePath, os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	// Décoder le contenu JSON dans une structure de données
	var data map[string][]string
	if err := json.NewDecoder(file).Decode(&data); err != nil {
		return err
	}

	// Vérifier si le dossier existe dans la structure de données
	_, ok := data[folderName]
	if !ok {
		// Si le dossier n'existe pas encore, créer une nouvelle entrée pour ce dossier
		data[folderName] = make([]string, 0)
	}

	// Ajouter le fichier au dossier correspondant
	data[folderName] = append(data[folderName], fileName)

	// Réinitialiser le curseur au début du fichier
	if _, err := file.Seek(0, 0); err != nil {
		return err
	}

	// Tronquer le fichier avant d'écrire les données mises à jour
	if err := file.Truncate(0); err != nil {
		return err
	}

	// Encoder la structure de données en JSON et écrire dans le fichier
	if err := json.NewEncoder(file).Encode(data); err != nil {
		return err
	}

	return nil
}

// Fonction pour ajouter un nouveau fichier .md
func (a *App) AddFile(fileName string, folderPath string) error {
	savePath := filepath.Join("./data", folderPath, fileName+".md")

	// Vérifier si le fichier existe déjà
	_, err := os.Stat(savePath)
	if os.IsNotExist(err) {
		// Créer le fichier s'il n'existe pas encore
		file, err := os.Create(savePath)
		if err != nil {
			return err
		}
		defer file.Close()

		// Mettre à jour data.json
		if err := UpdateFileJSON(folderPath, fileName); err != nil {
			return err
		}

		return nil
	} else if err != nil {
		// Gérer d'autres erreurs qui pourraient survenir lors de la vérification du fichier
		return err
	}

	// Si le fichier existe déjà, renvoyer une erreur
	return os.ErrExist
}
