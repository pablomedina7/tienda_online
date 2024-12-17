package main

import (
	"html/template"
	"net/http"
)

type Product struct {
	ID          string
	Name        string
	Price       float64
	Description string
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		tmpl, _ := template.ParseFiles("templates/index.html")
		products := []Product{
			{ID: "1", Name: "Pescado", Price: 5.99, Description: "Delicioso pescado fresco"},
			{ID: "2", Name: "Hielo", Price: 1.50, Description: "Hielo de primera calidad"},
		}
		tmpl.Execute(w, products)
	})

	http.ListenAndServe(":8080", nil)
}
