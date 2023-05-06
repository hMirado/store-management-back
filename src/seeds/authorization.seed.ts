import {Authorization} from "../models/authorization.model";

module.exports = () => {
  return Authorization.bulkCreate([
    // PAGE
    {
      // 1
      authorization_name: "Catégorie d'artcile",
      authorization_key: "PAGE_ITEM_CATEGORY"
    },
    {
      // 2
      authorization_name: "Artcile",
      authorization_key: "PAGE_ITEM"
    },
    {
      // 3
      authorization_name: "Stock",
      authorization_key: "PAGE_STOCK"
    },
    {
      // 4
      authorization_name: "Page de vente",
      authorization_key: "PAGE_SALE"
    },
    {
      // 5
      authorization_name: "Utilisateur",
      authorization_key: "PAGE_USER"
    },
    {
      // 6
      authorization_name: "Profil",
      authorization_key: "PAGE_PROFIL"
    },
    {
      // 7
      authorization_name: "Boutique",
      authorization_key: "PAGE_SHOP"
    },

    // CATEGORY
    {
      // 8
      authorization_name: "Créer une catégorie d'article",
      authorization_key: 'PAGE_ELEMENT_CREATE_ITEM_CATEGORY',
      authorization_parent: 1
    },
    {
      // 9
      authorization_name: "Modifier une catégorie d'article",
      authorization_key: 'PAGE_ELEMENT_EDIT_VIEW_ITEM_CATEGORY',
      authorization_parent: 1
    },
    {
      // 10
      authorization_name: "Supprimer une catégorie d'article",
      authorization_key: 'PAGE_ELEMENT_DELETE_ITEM_CATEGORY',
      authorization_parent: 1
    },
    // ITEM
    {
      // 11
      authorization_name: "Ajouter un article",
      authorization_key: 'PAGE_ELEMENT_ADD_ITEM',
      authorization_parent: 2
    },
    {
      // 12
      authorization_name: "Modifier un article",
      authorization_key: 'PAGE_ELEMENT_EDIT_VIEW_ITEM',
      authorization_parent: 2
    },
    {
      // 13
      authorization_name: "Supprimer une catégorie d'article",
      authorization_key: 'PAGE_ELEMENT_DELETE_ITEM',
      authorization_parent: 2
    },
    // STOCK
    {
      // 14
      authorization_name: "Ajout de stock",
      authorization_key: 'PAGE_ELEMENT_STOCK_ADD',
      authorization_parent: 3
    },
    {
      // 15
      authorization_name: "Import de stock",
      authorization_key: 'PAGE_ELEMENT_STOCK_IMPORT',
      authorization_parent: 3
    },
    {
      // 16
      authorization_name: "Transfert de stock",
      authorization_key: 'PAGE_ELEMENT_STOCK_TRANSFER',
      authorization_parent: 3
    },
    // USER
    {
      // 17
      authorization_name: "Ajouter un nouveau utilisateur",
      authorization_key: 'PAGE_ELEMENT_ADD_NEW_USER',
      authorization_parent: 5
    },
    {
      // 18
      authorization_name: "Modifier utilisateur",
      authorization_key: 'PAGE_ELEMENT_EDIT_VIEW_USER',
      authorization_parent: 5
    },
    {
      // 19
      authorization_name: "Réinitialiser le mot de passe",
      authorization_key: 'PAGE_ELEMENT_RESET_PASSWORD',
      authorization_parent: 18
    },
    {
      // 20
      authorization_name: "Supprimer un utilisateur",
      authorization_key: 'PAGE_ELEMENT_DELETE_USER',
      authorization_parent: 5
    },
    // ROLE
    {
      // 21
      authorization_name: "Créer un nouveau profil",
      authorization_key: 'PAGE_ELEMENT_CREATE_NEW_PROFIL',
      authorization_parent: 6
    },
    {
      // 22
      authorization_name: "Modifier un profil",
      authorization_key: 'PAGE_ELEMENT_EDIT_VIEW_PROFIL',
      authorization_parent: 6
    },
    {
      // 23
      authorization_name: "Supprimer un role",
      authorization_key: 'PAGE_ELEMENT_DELETE_PROFIL',
      authorization_parent: 6
    },
    // SHOP
    {
      // 24
      authorization_name: "Créer ou modfier un shop",
      authorization_key: 'PAGE_ELEMENT_CREATE_SHOP',
      authorization_parent: 7
    },
    // PAGE TRANSFER
    {
      // 25
      authorization_name: "Transfert",
      authorization_key: "PAGE_TRANSFER"
    },
    {
      // 26
      authorization_name: "Nouveau transfert d'article",
      authorization_key: 'PAGE_ELEMENT_CREATE_NEW_TRANSFER',
      authorization_parent: 25
    }
  ]).then(() => console.log('Seed Authorization complete'))
};