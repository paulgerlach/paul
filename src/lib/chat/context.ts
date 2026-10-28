import { getContext, setContext } from "svelte";
import type { ChatState } from "./chatState.svelte";

const KEY = Symbol("chat");

export const setChatContext = (state: ChatState) => setContext(KEY, state);
export const getChatContext = () => getContext<ChatState>(KEY);
