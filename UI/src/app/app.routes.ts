import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { PeopleList } from './components/people-list/people-list';
import { AddPerson } from './components/add-person/add-person';
import { UpdatePerson } from './components/update-person/update-person';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Home
    },
    {
        path: 'people',
        component: PeopleList
    },
    {
        path: 'add-person',
        component: AddPerson
    },
    {
        path: 'update-person/:id',
        component: UpdatePerson
    }
];
