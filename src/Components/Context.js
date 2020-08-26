import React, { Component } from "react";
import { storeProducts, detailProduct } from "../data";
const ProductContext = React.createContext();
class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalProduct: storeProducts[0],
    modalOpen: false,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0,
  };

  componentDidMount() {
    this.setProducts();
  }

  /*# we need setProducts logic to avoid any changes to the storeProducts data by the application as object in js
  is treated as a reference while assignment so any changes made in one will lead to change in other also
  # below method creates a copy of storeProducts data and assigned it to the state of the product context   */
  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach((item) => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState(() => {
      return { products: tempProducts };
    });
  };
  getProduct = (id) => {
    var product = this.state.products.find((item) => item.id === id);
    return product;
  };
  handleDetail = (id) => {
    const product = this.getProduct(id);
    this.setState(() => {
      return { detailProduct: product }; //task-> assign detailProduct of data.js with product
    });
  };

  addToCart = (id) => {
    //let tempProducts = [...this.state.products];
    //const index = tempProducts.indexOf(this.getProduct(id));
    //const product = tempProducts[index];
    const product = this.getProduct(id);
    product.inCart = true; /* here "product" takes a reference of a object of "this.state.products" so 
                              any change made in "product" will also reflects in "this.state.products" */
    product.count = 1;
    product.total = product.price;
    this.setState(
      () => {
        return {
          //products: tempProducts,
          cart: [...this.state.cart, product],
        };
      },
      () => {
        this.addTotal();
      }
    );
  };

  openModal = (id) => {
    const product = this.getProduct(id);
    //console.log("inside openModal");
    this.setState(() => {
      return { modalProduct: product, modalOpen: true };
    });
  };

  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };

  increment = (id) => {
    let tempCart = [...this.state.cart];
    let cartProduct = tempCart.find((item) => item.id === id);
    cartProduct.count += 1;
    cartProduct.total = cartProduct.count * cartProduct.price;

    this.setState(
      () => {
        return { cart: [...tempCart] };
      },
      () => {
        this.addTotal();
      }
    );
  };

  decrement = (id) => {
    let tempCart = [...this.state.cart];
    let cartProduct = tempCart.find((item) => item.id === id);
    cartProduct.count -= 1;
    if (cartProduct.count === 0) {
      this.removeItem(id);
    } else {
      cartProduct.total = cartProduct.count * cartProduct.price;

      this.setState(
        () => {
          return { cart: [...tempCart] };
        },
        () => {
          this.addTotal();
        }
      );
    }
  };

  removeItem = (id) => {
    let removedProduct = this.getProduct(id);
    let tempCart = [...this.state.cart];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;
    tempCart = tempCart.filter((item) => item.id !== id);
    this.setState(
      () => {
        return { cart: [...tempCart] };
      },
      () => {
        this.addTotal();
      }
    );
  };

  clearCart = () => {
    this.setState(
      () => {
        return { cart: [], cartSubTotal: 0, cartTax: 0, cartTotal: 0 };
      },
      () => {
        this.setProducts();
      }
    );
  };

  addTotal = () => {
    let subTotal = 0;
    this.state.cart.map((item) => {
      subTotal += item.total;
    });
    const tempTax = subTotal * 0.1; //for 10% tax
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(() => {
      return {
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total,
      };
    });
  };
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          closeModal: this.closeModal,
          openModal: this.openModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}
const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer };
