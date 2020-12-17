package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Livre;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;


/**
 * Spring Data  repository for the Livre entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LivreRepository extends JpaRepository<Livre, Long> {
    
	Optional<Livre> findByTitre(String titre);
	
	
	@Query(value = "select l from Theme t join t.livres l where t.theme = :theme")
	List<Livre> findAllByTheme(@Param("theme") String theme);
    
	@Query(value = "select l from Auteur a join a.livres l where a.auteur = :auteur")
	List<Livre> findAllByAuteur(@Param("auteur") String auteur);
}
