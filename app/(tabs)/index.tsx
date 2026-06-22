import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { supabase } from '../../lib/supabase';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at?: string;
};

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log(
        'Error loading tasks:',
        error.message
      );
      return;
    }

    setTasks(data || []);
  }

  async function addTask() {
    if (task.trim() === '') return;

    const taskTitle = task;

    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          title: taskTitle,
          completed: false,
        },
      ]);

    if (error) {
      console.log(
        'Error adding task:',
        error.message
      );
      return;
    }

    setTask('');

    Toast.show({
      type: 'success',
      text1: 'Task Added',
      text2: `"${taskTitle}" has been added.`,
    });

    loadTasks();
  }

  async function toggleTask(item: Task) {
    const { error } = await supabase
      .from('tasks')
      .update({
        completed: !item.completed,
      })
      .eq('id', item.id);

    if (error) {
      console.log(
        'Error updating task:',
        error.message
      );
      return;
    }

    loadTasks();
  }

  async function deleteTask(id: number) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(
        'Error deleting task:',
        error.message
      );
      return;
    }

    Toast.show({
      type: 'error',
      text1: 'Task Deleted',
      text2: 'Task removed successfully.',
    });

    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={headerStyles.header}>
          <Text style={headerStyles.title}>
            TaskFlow
          </Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter Task"
            value={task}
            onChangeText={setTask}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={addTask}
          >
            <MaterialIcons
              name="add"
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {tasks.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => toggleTask(item)}
            onLongPress={() =>
              deleteTask(item.id)
            }
          >
            <View style={styles.taskRow}>
              <MaterialIcons
                name={
                  item.completed
                    ? 'check-box'
                    : 'check-box-outline-blank'
                }
                size={20}
                color={
                  item.completed
                    ? '#2E5BBA'
                    : '#5A6472'
                }
              />

              <Text style={styles.taskText}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Toast />
    </>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2A44',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },

  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },

  addButton: {
    backgroundColor: '#2E5BBA',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  taskText: {
    fontSize: 15,
  },
});