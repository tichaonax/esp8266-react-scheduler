import { useCallback, useEffect, useRef, useState } from 'react';
import Sockette from 'sockette';
import { debounce } from 'lodash';

import { addAccessTokenParameter } from '../api/authentication';

interface WebSocketIdMessage {
  type: "id";
  id: string;
}

interface WebSocketPayloadMessage<D> {
  type: "payload";
  origin_id: string;
  payload: D;
}

export type WebSocketMessage<D> = WebSocketIdMessage | WebSocketPayloadMessage<D>;

export const useWs = <D>(wsUrl: string, wsThrottle: number = 100) => {

  const ws = useRef<Sockette>();
  const clientId = useRef<string>();
  const isMountedRef = useRef<boolean>(true);

  const [connected, setConnected] = useState<boolean>(false);
  const [data, setData] = useState<D>();
  const [transmit, setTransmit] = useState<boolean>();
  const [clear, setClear] = useState<boolean>();

  const onMessage = useCallback((event: MessageEvent) => {
    if (!isMountedRef.current) return;
    
    const rawData = event.data;
    if (typeof rawData === 'string' || rawData instanceof String) {
      const message = JSON.parse(rawData as string) as WebSocketMessage<D>;
      switch (message.type) {
        case "id":
          clientId.current = message.id;
          break;
        case "payload":
          if (clientId.current && isMountedRef.current) {
            setData((existingData) => (clientId.current === message.origin_id && existingData) || message.payload);
          }
          break;
      }
    }
  }, []);

  const doSaveData = useCallback((newData: D, clearData: boolean = false) => {
    if (!ws.current || !isMountedRef.current) {
      return;
    }
    if (clearData && isMountedRef.current) {
      setData(undefined);
    }
    ws.current.json(newData);
  }, []);

  const saveData = useRef(debounce(doSaveData, wsThrottle));

  const updateData = (newData: React.SetStateAction<D | undefined>, transmitData: boolean = true, clearData: boolean = false) => {
    setData(newData);
    setTransmit(transmitData);
    setClear(clearData);
  };

  useEffect(() => {
    if (!transmit) {
      return;
    }
    data && saveData.current(data, clear);
    setTransmit(false);
    setClear(false);
  }, [doSaveData, data, transmit, clear]);

  useEffect(() => {
    const instance = new Sockette(addAccessTokenParameter(wsUrl), {
      onmessage: onMessage,
      onopen: () => {
        if (isMountedRef.current) {
          setConnected(true);
        }
      },
      onclose: () => {
        if (isMountedRef.current) {
          clientId.current = undefined;
          setConnected(false);
          setData(undefined);
        }
      },
    });
    ws.current = instance;
    
    return () => {
      isMountedRef.current = false;
      instance.close();
    };
  }, [wsUrl, onMessage]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Cancel any pending debounced calls
      saveData.current.cancel();
    };
  }, []);

  return { connected, data, updateData } as const;
};
