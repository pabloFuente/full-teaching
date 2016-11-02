package com.fullteaching.backend;

import java.util.List;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Random;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Controller;

import com.fullteaching.backend.user.UserRepository;
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.course.CourseRepository;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.comment.CommentRepository;
import com.fullteaching.backend.comment.Comment;
import com.fullteaching.backend.entry.Entry;
import com.fullteaching.backend.entry.EntryRepository;
import com.fullteaching.backend.file.File;
import com.fullteaching.backend.file.FileRepository;
import com.fullteaching.backend.filegroup.FileGroup;
import com.fullteaching.backend.filegroup.FileGroupRepository;
import com.fullteaching.backend.forum.Forum;
import com.fullteaching.backend.forum.ForumRepository;
import com.fullteaching.backend.session.Session;
import com.fullteaching.backend.session.SessionRepository;

@Controller
public class DatabaseInitializer implements CommandLineRunner {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private CourseRepository courseRepository;
	
	@Override
	public void run(String... args) throws Exception {
		
		Random rand = new Random();
		
		//Sample users
		String defPicture = "/../assets/images/default_session_image.png";
		User user1 = new User("student1@gmail.com", "pass", "Student Imprudent", defPicture, "ROLE_STUDENT");
		User user2 = new User("student2@gmail.com", "pass", "Student Concludent", defPicture, "ROLE_STUDENT");
		User user3 = new User("teacher@gmail.com",  "pass", "Teacher Cheater",  defPicture, "ROLE_TEACHER");
		Set<User> setUsers = new HashSet<>();
		setUsers.add(user1);
		setUsers.add(user2);
		setUsers.add(user3);
		
		List<User> listUsers = new LinkedList<>();
		listUsers.add(user1);
		listUsers.add(user2);
		listUsers.add(user3);
		
		//Saving users
		userRepository.save(user1);
		userRepository.save(user2);
		userRepository.save(user3);
		
		
		//Sample comments
		List<Comment> listComments = new LinkedList<>();
		for (int i = 0; i < 30; i++){
			int userRandom = rand.nextInt(3);
			listComments.add(new Comment("This is comment " + (i+1) + ". Roses are red. Violets are blue. Comments have no color. They are just words. This does not rhyme.", 1477427508222L, listUsers.get(userRandom)));
		}
		
		//Sample entries
		List<Entry> listEntries = new LinkedList<>();
		for (int i = 0; i < 10; i++){
			int userRandom = rand.nextInt(3);
			listEntries.add(new Entry("This is entry number " + (i+1), 1477427508222L, listUsers.get(userRandom)));
		}
		
		//Random allocation of comments inside entries
		int iEntry = 0;
		while ((!listComments.isEmpty()) && (iEntry < listEntries.size())){
			int nRandom = rand.nextInt(7);
			Entry e = listEntries.get(iEntry);
			int i = 0;
			while ((i < nRandom) && (!listComments.isEmpty())){
				e.getComments().add(listComments.get(0));
				listComments.remove(0);
				i++;
			}
			iEntry++;
		}
		
		//Sample files
		List<File> listFiles = new LinkedList<>();
		String[] nameArray = {"Interesting Web Link", "Cool PDF File", "This is a video"};
		for (int i = 0; i < 20; i++){
			int randomN = rand.nextInt(3);
			listFiles.add(new File(randomN, nameArray[randomN], "www.awesomeurl.com"));
		}
		
		//Sample fileGroups
		List<FileGroup> listFileGroups = new LinkedList<>();
		String[] titleArray = {"Take a look if you have plenty of time", "Optional tasks", "Lesson 1 - Important files", "Real Examples for Lesson 2", "Optional tasks"};
		for (int i = 0; i < 5; i++){
			listFileGroups.add(new FileGroup(titleArray[i]));
		}
		
		//Allocation of files and fileGroups inside fileGroups
		listFileGroups.get(0).getFiles().addAll(listFiles.subList(0, 5));
		listFileGroups.get(1).getFiles().addAll(listFiles.subList(5, 7));
		listFileGroups.get(2).getFiles().addAll(listFiles.subList(7, 12));
		listFileGroups.get(3).getFiles().addAll(listFiles.subList(12, 18));
		listFileGroups.get(4).getFiles().addAll(listFiles.subList(18, 20));
		
		listFileGroups.get(0).setFileGroupParent(listFileGroups.get(1));
		listFileGroups.get(1).getFileGroups().add(listFileGroups.get(0));
		listFileGroups.get(4).setFileGroupParent(listFileGroups.get(3));
		listFileGroups.get(3).getFileGroups().add(listFileGroups.get(4));
		
		/*//Saving root fileGroups (and children fileGroups and all files in cascade)
		fileGroupRepository.save(listFileGroups.get(1));
		fileGroupRepository.save(listFileGroups.get(2));
		fileGroupRepository.save(listFileGroups.get(3));*/
		
		//Sample forums
		Forum f1 = new Forum(true);
		Forum f2 = new Forum(true);
		
		f1.setEntries(listEntries.subList(0, 6));
		f2.setEntries(listEntries.subList(6, 10));
		
		/*//Saving forums (and entries and comments in cascade)
		forumRepository.save(f1);
		forumRepository.save(f2);*/
		
		//Sample courseDetails
		CourseDetails cd1 = new CourseDetails();
		CourseDetails cd2 = new CourseDetails();
		
		cd1.setForum(f1);
		cd2.setForum(f2);
		cd1.getFiles().add(listFileGroups.get(1));
		cd1.getFiles().add(listFileGroups.get(2));
		cd2.getFiles().add(listFileGroups.get(3));
		
		//Sample courses
		Course c1 = new Course("Pseudoscientific course for treating the evil eye", "", user3);
		Course c2 = new Course("Don't mind. This is a real course", "", user3);
		
		c1.setCourseDetails(cd1);
		c2.setCourseDetails(cd2);
		c1.setAttenders(setUsers);
		c2.getAttenders().add(user1);
		c2.getAttenders().add(user3);
		
		//Sample sessions
		Session s1 = new Session("Session 1: Introduction to Web", "This is a nice description about this session.", 1520719320000L);
		s1.setCourse(c1);
		Session s2 = new Session("Nice examples", "This is a nice description about this session.", 1525964400000L);
		s2.setCourse(c1);
		Session s3 = new Session("Project analisys", "This is a nice description about this session.", 1520805840000L);
		s3.setCourse(c1);
		Session s4 = new Session("Session 3: New Web Technologies", "This is a nice description about this session.", 1457708400000L);
		s4.setCourse(c2);
		Session s5 = new Session("Session 2: Databse integration", "This is a nice description about this session.", 1462978800000L);
		s5.setCourse(c2);
		
		c1.getSessions().add(s1);
		c1.getSessions().add(s2);
		c1.getSessions().add(s3);
		c2.getSessions().add(s4);
		c2.getSessions().add(s5);
		
		//Saving courses
		courseRepository.save(c1);
		courseRepository.save(c2);
	}

}
