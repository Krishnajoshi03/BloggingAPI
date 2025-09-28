package com.blog.demo.entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "categories")
@Entity
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class Category {

	@Column(name = "title", nullable = false, length = 100)
	String title;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	Integer categoryId;
	@Column(name = "description")
	String description;
	
	@OneToMany(mappedBy = "category",cascade = jakarta.persistence.CascadeType.ALL)
	private List<Post> posts;
}
