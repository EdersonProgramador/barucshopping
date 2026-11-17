import express from 'express';
import { createApp } from './create-app';

// Vercel detects Express entrypoints by a direct `express` import in this file.
const app: ReturnType<typeof express> = createApp();

export default app;
