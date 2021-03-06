import React, { Component } from "react";
import axios from "../../../axios";
import classes from "./ContactData.css";
import { connect } from "react-redux";
import { Button, Spinner, Input } from "../../../components";
import { withErrorHandler } from "../../../hoc";
import { purchaseBurger } from "../../../store/actions";
import { updateObject, checkValidity } from "../../../shared/";

class ContactData extends Component {
  componentDidMount() {
    window.scrollTo(0, 600);
  }

  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: { name: "name", type: "text", placeholder: "Your Name" },
        value: "",
        validation: {
          minLength: 5,
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: "input",
        elementConfig: { name: "street", type: "text", placeholder: "Street" },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          name: "zipcode",
          type: "text",
          placeholder: "ZIP Code"
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLenght: 15,
          isNumeric: true
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: "input",
        elementConfig: {
          name: "country",
          type: "text",
          placeholder: "Country"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: "input",
        elementConfig: {
          name: "email",
          type: "email",
          placeholder: "Your E-mail"
        },
        value: "",
        validation: {
          required: true,
          email: true
        },
        valid: false,
        touched: false
      },
      delivaryMethod: {
        elementType: "select",
        elementConfig: {
          name: "delivery method",
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" }
          ]
        },
        value: "fastest",
        validation: {},
        valid: true
      }
    },
    formIsValid: false
  };

  orderHandler = event => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }
    const order = {
      ingredients: this.props.ings,
      totalPrice: this.props.price,
      userId: this.props.userId,
      orderData: formData
    };

    this.props.onOrderBurger(order, this.props.token);
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(
      this.state.orderForm[inputIdentifier],
      {
        value: event.target.value,
        touched: true,
        valid: checkValidity(
          event.target.value,
          this.state.orderForm[inputIdentifier].validation
        )
      }
    );

    const updatedOrderForm = updateObject(this.state.orderForm, {
      [inputIdentifier]: updatedFormElement
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  render() {
    let FormElementsArray = [];
    for (let key in this.state.orderForm) {
      FormElementsArray.push({ id: key, config: this.state.orderForm[key] });
    }

    let formElements = FormElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        changed={event => this.inputChangedHandler(event, formElement.id)}
        invalid={!formElement.config.valid}
        touched={formElement.config.touched}
        shouldValidate={formElement.config.validation}
      />
    ));

    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <div className={classes.ContactData}>
        <h1>Enter Your Contact Data</h1>
        <form>
          {formElements}
          <Button
            btnType="Success"
            disabled={!this.state.formIsValid}
            clicked={this.orderHandler}
          >
            ORDER
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerReducr.ingredients,
    price: state.burgerReducr.totalPrice,
    isLoading: state.orderReducr.loading,
    token: state.authReducr.token,
    userId: state.authReducr.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(purchaseBurger(orderData, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
