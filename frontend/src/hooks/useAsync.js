import { useCallback, useEffect, useState } from "react";
import { getApiError } from "../api/client";
import { useToast } from "../context/ToastContext";

export function useAsync(loader, deps = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { notify } = useToast();

  const run = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await loader();
      setData(result);
      return result;
    } catch (err) {
      const message = getApiError(err);
      setError(message);
      notify(message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, setData, loading, error, refresh: run };
}
