//! Alpine
import Alpine from 'alpinejs';
window.Alpine = Alpine;

//? Alpine Datas
import xDatasApp from './xDatasApp';
Alpine.data('DatasApp', xDatasApp);

import xProductDatas from './xProductDatas';
Alpine.data('ProductDatas', xProductDatas);

import Cart from '../components/CartDrawer';
Alpine.data('CartDrawer', Cart);

Alpine.start();
