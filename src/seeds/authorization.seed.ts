import {Authorization} from "../models/authorization.model";

module.exports = () => {
  return Authorization.bulkCreate([
    // PAGE
    {
      authorization_name: "Catégorie d'artcile",
      authorization_key: "PAGE_ITEM_CATEGORY"
    },
    {
      authorization_name: "Artcile",
      authorization_key: "PAGE_ITEM"
    },
    {
      authorization_name: "Stock",
      authorization_key: "PAGE_STOCK"
    },
    {
      authorization_name: "Page de vente",
      authorization_key: "PAGE_SALE"
    },
    {
      authorization_name: "Utilisateur",
      authorization_key: "PAGE_USER"
    },
    {
      authorization_name: "Rôle",
      authorization_key: "PAGE_ROLE"
    },
    {
      authorization_name: "Boutique",
      authorization_key: "PAGE_SHOP"
    },

    // CATEGORY
    {
      authorization_name: "Importer les catégories d'articles",
      authorization_key: 'PAGE_ELEMENT_IMPORT_ITEM_CATEGORY',
      authorization_parent: 1
    },
    {
      authorization_name: "Créer une catégorie d'article",
      authorization_key: 'PAGE_ELEMENT_CREATE_ITEM_CATEGORY',
      authorization_parent: 1
    },
    {
      authorization_name: "Modifier une catégorie d'article",
      authorization_key: 'PAGE_ELEMENT_EDIT_VIEW_ITEM_CATEGORY',
      authorization_parent: 1
    },
    {
      authorization_name: "Désactiver une catégorie d'article",
      authorization_key: 'PAGE_ELEMENT_DISABLE_ITEM_CATEGORY',
      authorization_parent: 1
    },
    // ITEM
    {
      authorization_name: "Importer des articles",
      authorization_key: "PAGE_ELEMENT_IMPORT_ITEM",
      authorization_parent: 2
    },
    {
      authorization_name: "Ajouter un article",
      authorization_key: 'PAGE_ELEMENT_ADD_ITEM',
      authorization_parent: 2
    },
    {
      authorization_name: "Modifier un article",
      authorization_key: 'PAGE_ELEMENT_EDIT_VIEW_ITEM',
      authorization_parent: 2
    },
    {
      authorization_name: "Désactiver une catégorie d'article",
      authorization_key: 'PAGE_ELEMENT_DISABLE_ITEM',
      authorization_parent: 2
    },
    // STOCK
    {
      authorization_name: "Ajout de stock",
      authorization_key: 'PAGE_ELEMENT_STOCK_ADD',
      authorization_parent: 3
    },
    {
      authorization_name: "Import de stock",
      authorization_key: 'PAGE_ELEMENT_STOCK_IMPORT',
      authorization_parent: 3
    },
    {
      authorization_name: "Transfert de stock",
      authorization_key: 'PAGE_ELEMENT_STOCK_TRANSFER',
      authorization_parent: 3
    },
    // USER
    {
      authorization_name: "Ajouter un nouveau utilisateur",
      authorization_key: 'PAGE_ELEMENT_ADD_NEW_USER',
      authorization_parent: 5
    },
    {
      authorization_name: "Modifier utilisateur",
      authorization_key: 'PAGE_ELEMENT_EDIT_VIEW_USER',
      authorization_parent: 5
    },
    {
      authorization_name: "Modifier le rôle d'un utilisateur",
      authorization_key: 'PAGE_ELEMENT_EDIT_USER_ROLE',
      authorization_parent: 5
    },
    {
      authorization_name: "Réinitialiser le mot de passe",
      authorization_key: 'PAGE_ELEMENT_RESET_PASSWORD',
      authorization_parent: 5
    },
    {
      authorization_name: "Désactiver un utilisateur",
      authorization_key: 'PAGE_ELEMENT_DISABLE_USER',
      authorization_parent: 5
    },
    // ROLE
    {
      authorization_name: "Créer un nouveau rôle",
      authorization_key: 'PAGE_ELEMENT_CREATE_NEW_ROLE',
      authorization_parent: 6
    },
    {
      authorization_name: "Modifier un rôle",
      authorization_key: 'PAGE_ELEMENT_EDIT_VIEW_ROLE',
      authorization_parent: 6
    },
    {
      authorization_name: "Désactiver un role",
      authorization_key: 'PAGE_ELEMENT_DISABLE_ROLE',
      authorization_parent: 6
    },
    // SHOP
    {
      authorization_name: "Créer ou modfier un shop",
      authorization_key: 'PAGE_ELEMENT_CREATE_SHOP',
      authorization_parent: 7
    },
  ]).then(() => console.log('Seed Authorization complete'))
};