import Header from '../components/Header'
import Menu from '../components/Menu'
import Footer from '../components/Footer'

import * as React from 'react';
import {get} from 'lodash';
import Link from 'next/link';
import {Navbar, Nav, Image, Button, Collapse, Modal} from 'react-bootstrap';
import Head from 'next/head';
import Layout from '../components/Layout';
import dayjs from "dayjs";
import Router from "next/router";
import encryptedLS from "libs/encryptedLS";
class Index extends React.Component {
  componentDidMount() {
    Router.replace("/payments");
  }
    render () {
      
      return (
        <Layout title="Payment" classname="dashboard theme-light">
        </Layout>
      );
    }
  }
  export default Index;
  