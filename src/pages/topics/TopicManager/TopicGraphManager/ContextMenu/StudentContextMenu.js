import React from 'react';
import { useReactFlow } from 'reactflow';

import { MdCheck } from "react-icons/md";
import { MdBlock } from "react-icons/md";

import {useUpdateUserInfoMutation} from "../../../../../services/user";
import ContextMenu from "./ContextMenu";


export default function StudentContextMenu({user, id, ...props}) {
  const { setNodes } = useReactFlow();
  const [updateUser, updateUserResult] = useUpdateUserInfoMutation()

  const markAsAchieved = () => {
    const body = {
      understands: id
    }

    updateUser({id: user._id, body}).unwrap()
      .then(result => {
        if (result) {
          setNodes((prevNodes) => {
            return prevNodes.map((node) => {
              if (node.id === id) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    understood: true
                  }
                };
              } else {
                return node;
              }
            });
          });
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const unmarkAsAchieved = () => {
    const body = {
      understands: user.understands.map(t => t._id).filter(t => t !== id)
    }

    updateUser({id: user._id, body}).unwrap()
      .then(result => {
        if (result) {
          setNodes((prevNodes) => {
            return prevNodes.map((node) => {
              if (node.id === id) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    understood: false
                  }
                };
              } else {
                return node;
              }
            });
          });
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <ContextMenu {...props}>
      <button onClick={markAsAchieved}><MdCheck /> Goal achieved</button>
      <button onClick={unmarkAsAchieved}><MdBlock /> Remove from achieved</button>
    </ContextMenu>
  );
}
