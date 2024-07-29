import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

function Test() {
  const [conn, setConn] = useState<Socket>();
  const [result, setResult] = useState("");
  const [list, setList] = useState([]);

  function fetchData() {
    fetch("http://localhost:8000/fingerprints")
      .then((res) => res.json())
      .then((data) => {
        setList(data);
      });
  }

  useEffect(() => {
    fetchData();
    const socket = io("http://localhost:8000");

    setConn(socket);

    socket.on("message", (data) => {
      setResult(data);

      if (data === "Remove finger...") {
        setTimeout(() => {
          setResult("Please place your finger on the sensor");
          socket.emit("compareFinger");
        }, 2000);
      }

      if (data.startsWith("enroll_success:")) {
        setResult(
          "Fingerprint enrolled successfully at position " + data.split(":")[1]
        );
        fetchData();
      }

      if (data === "Template deleted!") {
        fetchData();
      }
    });

    return () => {
      socket.disconnect();
      setConn(undefined);
    };
  }, []);

  function searchFingerprint() {
    if (conn) {
      setResult("Please place your finger on the sensor");
      conn.emit("searchFingerprint");
    }
  }

  function enrollFingerprint() {
    if (conn) {
      setResult("Please place your finger on the sensor");
      conn.emit("enrollFinger");
    }
  }

  function deleteFinger() {
    const toBeDeleted = prompt("Enter the fingerprint number to delete");
    if (toBeDeleted) {
      fetch(`http://localhost:8000/fingerprints/${toBeDeleted}`, {
        method: "DELETE",
      }).then(() => {
        fetchData();
      });
    }
  }

  return (
    <main className="flex flex-col p-12 items-center min-h-dvh bg-zinc-900 text-zinc-200">
      <div className="border-2 border-zinc-200 p-4 w-full">
        <p className="text-2xl font-bold mb-4">Search Fingerprint</p>
        <p className="text-lg mb-4">{result}</p>
        <div className="flex gap-4">
          <button
            onClick={searchFingerprint}
            className="bg-blue-500 text-white px-6 py-4 rounded-md uppercase tracking-widest"
          >
            SEARCH
          </button>
          <button
            onClick={enrollFingerprint}
            className="bg-green-500 text-white px-6 py-4 rounded-md uppercase tracking-widest"
          >
            ENROLL
          </button>
          <button
            onClick={() => {
              deleteFinger();
            }}
            className="bg-red-500 text-white px-6 py-4 rounded-md uppercase tracking-widest"
          >
            DELETE
          </button>
        </div>
      </div>
      <div className="border-2 border-zinc-200 p-4 w-full mt-8">
        <p className="text-2xl font-bold mb-4">Fingerprints</p>
        <ul>
          {list.map((item: boolean, index) => (
            <li key={index} className="text-lg">
              {item
                ? `Fingerprint ${index} - Enrolled`
                : `Fingerprint ${index} - Not Enrolled`}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default Test;
