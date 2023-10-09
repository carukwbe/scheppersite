# Scheppersite

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.0.

## Install
`npm install`
`npm install -g @angular/cli@latest`

dann sollte `ng serve` funktionieren
und dann zu `http://localhost:4200/` navigieren

## deploy

einmalig:
    `firebase init`
    -> Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys
    -> dist/scheppern-frontend
    -> alle weitern fragen mit nein beantworten

immer wieder:
    `ng build`
    `firebase deploy`
