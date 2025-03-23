class NewProductObserver {
    update(product) {
        console.log(`New product created: ${product.title}`);
        // Thực hiện các hành động khác khi có sản phẩm mới
    }
}

module.exports = NewProductObserver;