package com.blog.demo.entities;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "posts")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class Post {

	@Id
	@GeneratedValue(
			strategy = jakarta.persistence.GenerationType.IDENTITY
			)
	private Integer postId;
	@Column(name = "title", length = 100, nullable = false)
	private String title;
	@Column(length = 1000)
	private String content;
	@Column(length = 1000)
	private String imageName;
	
	@Column
	private Date createdAt;
	
	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;
	@ManyToOne
	private User user;
	
	
}
