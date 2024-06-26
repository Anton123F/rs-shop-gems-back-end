#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RsShopGemsBackEndStack } from '../lib/rs-shop-gems-back-end-stack';

const app = new cdk.App();
new RsShopGemsBackEndStack(app, 'RsShopGemsBackEndStack', {});