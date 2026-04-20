"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import {
  MANUAL_NODE_IDS,
  RECORDING_EDGES,
  RECORDING_NODES,
  type NodeIconId,
} from "./scriptedRecording";

export interface ReviewNode {
  id: string;
  label: string;
  iconId: NodeIconId;
  position: { x: number; y: number };
  isManual: boolean;
}

export interface ReviewEdge {
  id: string;
  source: string;
  target: string;
}

interface ReviewState {
  nodes: ReviewNode[];
  edges: ReviewEdge[];
  answers: Record<string, string>;
  freeText: string;
}

type Action =
  | { type: "rename"; id: string; label: string }
  | { type: "toggleManual"; id: string; isManual: boolean }
  | { type: "delete"; id: string }
  | { type: "move"; id: string; position: { x: number; y: number } }
  | { type: "answer"; key: string; value: string }
  | { type: "setFreeText"; value: string };

function reducer(state: ReviewState, action: Action): ReviewState {
  switch (action.type) {
    case "rename":
      return {
        ...state,
        nodes: state.nodes.map((n) =>
          n.id === action.id ? { ...n, label: action.label } : n,
        ),
      };
    case "toggleManual":
      return {
        ...state,
        nodes: state.nodes.map((n) =>
          n.id === action.id ? { ...n, isManual: action.isManual } : n,
        ),
      };
    case "delete": {
      const nodes = state.nodes.filter((n) => n.id !== action.id);
      const edges = state.edges.filter(
        (e) => e.source !== action.id && e.target !== action.id,
      );
      return { ...state, nodes, edges };
    }
    case "move":
      return {
        ...state,
        nodes: state.nodes.map((n) =>
          n.id === action.id ? { ...n, position: action.position } : n,
        ),
      };
    case "answer":
      return {
        ...state,
        answers: { ...state.answers, [action.key]: action.value },
      };
    case "setFreeText":
      return { ...state, freeText: action.value };
    default:
      return state;
  }
}

function initialState(): ReviewState {
  return {
    nodes: RECORDING_NODES.map((n) => ({
      id: n.id,
      label: n.label,
      iconId: n.iconId,
      position: { ...n.position },
      isManual: MANUAL_NODE_IDS.includes(n.id),
    })),
    edges: RECORDING_EDGES.map((e) => ({ ...e })),
    answers: {},
    freeText: "",
  };
}

interface ReviewContextValue extends ReviewState {
  rename: (id: string, label: string) => void;
  toggleManual: (id: string, isManual: boolean) => void;
  deleteNode: (id: string) => void;
  moveNode: (id: string, position: { x: number; y: number }) => void;
  answer: (key: string, value: string) => void;
  setFreeText: (value: string) => void;
  reset: () => void;
}

const ReviewContext = createContext<ReviewContextValue | null>(null);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const rename = useCallback(
    (id: string, label: string) => dispatch({ type: "rename", id, label }),
    [],
  );
  const toggleManual = useCallback(
    (id: string, isManual: boolean) =>
      dispatch({ type: "toggleManual", id, isManual }),
    [],
  );
  const deleteNode = useCallback(
    (id: string) => dispatch({ type: "delete", id }),
    [],
  );
  const moveNode = useCallback(
    (id: string, position: { x: number; y: number }) =>
      dispatch({ type: "move", id, position }),
    [],
  );
  const answer = useCallback(
    (key: string, value: string) => dispatch({ type: "answer", key, value }),
    [],
  );
  const setFreeText = useCallback(
    (value: string) => dispatch({ type: "setFreeText", value }),
    [],
  );
  const reset = useCallback(() => {
    const fresh = initialState();
    dispatch({ type: "setFreeText", value: fresh.freeText });
  }, []);

  const value = useMemo<ReviewContextValue>(
    () => ({
      ...state,
      rename,
      toggleManual,
      deleteNode,
      moveNode,
      answer,
      setFreeText,
      reset,
    }),
    [
      state,
      rename,
      toggleManual,
      deleteNode,
      moveNode,
      answer,
      setFreeText,
      reset,
    ],
  );

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
}

export function useReview(): ReviewContextValue {
  const ctx = useContext(ReviewContext);
  if (!ctx) {
    throw new Error("useReview must be used inside a <ReviewProvider>");
  }
  return ctx;
}
