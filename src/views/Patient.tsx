import React from 'react';
import NivoVoicemap from '../components/map/NivoVoicemap';
import { SocketProp } from '../types/SocketProp.types';

export default function Patient({socket}: SocketProp) {
  return (
    <NivoVoicemap socket={socket} width='100vw' height='100vh'/>
  );
}