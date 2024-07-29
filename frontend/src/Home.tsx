import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "./firebase.config";
import { collection } from "firebase/firestore";
import AddStudentModal from "./ModifyStudentModal";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import DeleteStudentConfirmationModal from "./DeleteStudentConfirmationModal";

function getChineseClassName(classId: string) {
  const seniorOrJunior = classId.startsWith("S") ? "高" : "初";
  const grade = ["一", "二", "三"][parseInt(classId.slice(1, 2)) - 1];
  let stream = "";
  if (seniorOrJunior === "高") {
    switch (classId.slice(2, 3)) {
      case "S":
        stream = "理";
        break;
      case "A":
        stream = "文商";
        break;
      case "C":
        stream = "商";
        break;
    }
  }

  const classNumber =
    seniorOrJunior === "高"
      ? classId.match(/.+(\d+)$/)?.[1]
      : classId.slice(2, 4);

  return `${seniorOrJunior}${grade}${stream}${parseInt(classNumber || "")}`;
}

function Home() {
  const [modifyStudentModalOpenType, setModifyStudentModalOpenType] = useState<
    "add" | "update" | false
  >(false);
  const [students, loading, error] = useCollection(
    collection(firestore, "students")
  );
  const [
    deleteStudentConfirmationModalOpen,
    setDeleteStudentConfirmationModalOpen,
  ] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>();

  if (loading) {
    return (
      <div className="w-full flex-1 flex items-center text-2xl gap-8 justify-center flex-col">
        <Icon icon="svg-spinners:180-ring" className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex-1 flex items-center text-2xl gap-8 justify-center text-red-500 flex-col">
        <Icon icon="uil:exclamation-octagon" className="w-24 h-24" />
        Error: {error.message}
      </div>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between w-full">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">学生资料库</h1>
          <p className="text-xl uppercase tracking-wider">
            Student Information Database
          </p>
        </div>
        <button
          onClick={() => {
            setModifyStudentModalOpenType("add");
          }}
          className="bg-blue-400 text-zinc-900 text-white font-medium px-6 py-4 flex items-center gap-4 rounded-md uppercase tracking-widest"
        >
          <Icon icon="uil:plus" className="w-5 h-5" />
          <div className="flex flex-col text-left">
            <span>添加学生</span>
            <span className="text-sm">Add Student</span>
          </div>
        </button>
      </header>
      <section className="mt-8">
        <ul className="flex flex-col gap-4">
          {students?.docs.map((student) => (
            <li
              key={student.id}
              className="flex gap-2 items-center justify-between p-6 bg-zinc-100/5 rounded-md"
            >
              <div className="flex flex-col gap-2">
                <p className="text-base flex text-zinc-400 items-center gap-2">
                  {student.id}
                  <Icon
                    icon="tabler:circle-filled"
                    className="w-1 h-1 mt-[1px]"
                  />
                  {getChineseClassName(student.data().class)} (
                  {student.data().seat_no})
                </p>
                <p className="text-lg">
                  {student.data().name_ch} {student.data().name_en}
                </p>
              </div>
              <Menu>
                <MenuButton className="text-zinc-500 hover:text-zinc-100 p-2 rounded-md hover:bg-zinc-100/10 transition">
                  <Icon icon="tabler:dots-vertical" className="w-5 h-5" />
                </MenuButton>
                <MenuItems
                  transition
                  anchor="bottom end"
                  className="w-52 origin-top-right rounded-md border border-zinc-700 bg-zinc-800 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:6px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  <MenuItem>
                    <button
                      onClick={() => {
                        setModifyStudentModalOpenType("update");
                        setSelectedStudent(student);
                      }}
                      className="group flex w-full items-center gap-2 rounded-md py-4 px-4 data-[focus]:bg-zinc-100/10 transition text-zinc-400 data-[focus]:text-zinc-100"
                    >
                      <Icon icon="uil:pen" className="w-5 h-5" />
                      编辑 Edit
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => {
                        setDeleteStudentConfirmationModalOpen(true);
                        setSelectedStudent(student);
                      }}
                      className="group flex w-full items-center gap-2 rounded-md py-4 px-4 data-[focus]:bg-zinc-100/10 transition text-red-500 data-[focus]:text-red-600"
                    >
                      <Icon icon="uil:trash" className="w-5 h-5" />
                      删除 Delete
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </li>
          ))}
        </ul>
        <AddStudentModal
          openType={modifyStudentModalOpenType}
          setOpenType={setModifyStudentModalOpenType}
          existedData={
            modifyStudentModalOpenType === "update"
              ? selectedStudent
              : undefined
          }
        />
        <DeleteStudentConfirmationModal
          isOpen={deleteStudentConfirmationModalOpen}
          setIsOpen={() => {
            setDeleteStudentConfirmationModalOpen(false);
          }}
          toBeDeleted={selectedStudent}
        />
      </section>
    </>
  );
}

export default Home;
