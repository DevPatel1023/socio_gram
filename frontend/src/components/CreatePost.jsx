import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { asyncThunkCreator } from "@reduxjs/toolkit";

const CreatePost = ({ open, setOpen }) => {
  const createPostHandler = async (e) => {
    e.preventDefault();
    try {
    } catch (error) {}
  };
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <form onSubmit={createPostHandler}>Hello</form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
